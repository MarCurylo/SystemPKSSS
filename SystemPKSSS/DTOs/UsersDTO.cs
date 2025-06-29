public record LoginRequest(string username, string password);
public record CreateUserRequest(string username, string email, string password, string role);
public record ChangeRoleRequest(string Role);
