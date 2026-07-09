using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Microsoft.Extensions.Options;
using BCrypt.Net;
using CustomerAnalytics.Api.DTOs;
using CustomerAnalytics.Api.Models;
using CustomerAnalytics.Api.Repositories;
using CustomerAnalytics.Api.Configuration;

namespace CustomerAnalytics.Api.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task<AuthResponseDto> LoginAsync(LoginDto dto);
    Task<UserDto?> GetUserByIdAsync(int userId);
}

public class AuthService : IAuthService
{
    private readonly ICustomerRepository _customerRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(ICustomerRepository customerRepository, IOptions<JwtSettings> jwtSettings)
    {
        _customerRepository = customerRepository;
        _jwtSettings = jwtSettings.Value;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        if (await _customerRepository.ExistsAsync(dto.Email))
        {
            return new AuthResponseDto { Success = false };
        }

        var customer = new Customer
        {
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            PhoneNumber = dto.PhoneNumber,
            CreatedAt = DateTime.UtcNow,
            AcquisitionSource = "Direct"
        };

        await _customerRepository.CreateAsync(customer);

        var token = GenerateJwtToken(customer);

        return new AuthResponseDto
        {
            Success = true,
            Token = token,
            Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
            User = MapToUserDto(customer)
        };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var customer = await _customerRepository.GetByEmailAsync(dto.Email);

        if (customer == null || !BCrypt.Net.BCrypt.Verify(dto.Password, customer.PasswordHash))
        {
            return new AuthResponseDto { Success = false };
        }

        customer.LastLoginAt = DateTime.UtcNow;
        await _customerRepository.UpdateAsync(customer);

        var token = GenerateJwtToken(customer);

        return new AuthResponseDto
        {
            Success = true,
            Token = token,
            Expiration = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
            User = MapToUserDto(customer)
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(int userId)
    {
        var customer = await _customerRepository.GetByIdAsync(userId);
        return customer != null ? MapToUserDto(customer) : null;
    }

    private string GenerateJwtToken(Customer customer)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.SecretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, customer.Id.ToString()),
            new Claim(ClaimTypes.Email, customer.Email),
            new Claim(ClaimTypes.GivenName, customer.FirstName),
            new Claim(ClaimTypes.Surname, customer.LastName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: _jwtSettings.Issuer,
            audience: _jwtSettings.Audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static UserDto MapToUserDto(Customer customer)
    {
        return new UserDto
        {
            Id = customer.Id,
            Email = customer.Email,
            FirstName = customer.FirstName,
            LastName = customer.LastName,
            PhoneNumber = customer.PhoneNumber,
            CreatedAt = customer.CreatedAt,
            LastLoginAt = customer.LastLoginAt
        };
    }
}
