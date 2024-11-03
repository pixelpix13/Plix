import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand } from '@aws-sdk/client-cognito-identity-provider';
import { awsConfig } from './aws-config.js';

const client = new CognitoIdentityProviderClient({ region: awsConfig.region });

export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }

        const params = {
            ClientId: awsConfig.clientId,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'preferred_username', Value: username }
            ]
        };

        const command = new SignUpCommand(params);
        const response = await client.send(command);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for verification.",
        });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: awsConfig.clientId,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };

        const command = new InitiateAuthCommand(params);
        const response = await client.send(command);

        const idToken = response.AuthenticationResult.IdToken;

        // Set a cookie with a name related to your application, "Plix"
        res.cookie("Plix-auth", idToken, { httpOnly: true });
        res.status(200).json({ success: true, message: "Login successful" });
    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ success: false, message: error.message || "Invalid credentials" });
    }
}

export async function logout(req, res) {
    try {
        // Clear the cookie with the same name you set in the login function
        res.clearCookie("Plix-auth");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
