import { CognitoIdentityProviderClient, SignUpCommand, InitiateAuthCommand,ConfirmSignUpCommand } from '@aws-sdk/client-cognito-identity-provider';
import { awsConfig } from './aws-config.js';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

const client = new CognitoIdentityProviderClient({ region: awsConfig.region });


export async function signup(req, res) {
    try {
        const { email, password, username } = req.body;

        // Validate input
        if (!email || !password || !username) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if the username is in an email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(username)) {
            return res.status(400).json({ success: false, message: "Username cannot be in email format." });
        }

        const params = {
            ClientId: awsConfig.clientId,
            Username: username, // Use `username` as the unique identifier
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email } // Add email as a user attribute
            ]
        };

        const command = new SignUpCommand(params);
        const response = await client.send(command);

        res.status(201).json({
            success: true,
            message: "Registration successful. Please check your email for verification.",
        });
    } catch (error) {
        console.error("Error in signup controller:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
}

export async function verify(req, res) {
    try {
        const { username, code } = req.body;

        const params = {
            ClientId: awsConfig.clientId,
            Username: username,
            ConfirmationCode: code,
        };

        const command = new ConfirmSignUpCommand(params);
        await client.send(command);

        res.status(200).json({ success: true, message: "Verification successful." });
    } catch (error) {
        console.error("Error in verify controller:", error);
        res.status(500).json({ success: false, message: error.message || "Verification failed." });
    }
}

export async function login(req, res) {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(400).json({ success: false, message: "All fields are required" });
		}

		// Authenticate with Cognito or your preferred authentication method
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

		// Assuming AWS Cognito returns an ID token or a custom JWT here:
		const idToken = response.AuthenticationResult.IdToken;

		// Send the token back to the client
		res.status(200).json({
			success: true,
			token: idToken, // Send token back to the client
			message: "Login successful"
		});
	} catch (error) {
		console.error("Error in login controller:", error);
		res.status(500).json({ success: false, message: error.message || "Invalid credentials" });
	}
}

export async function logout(req, res) {
    try {
        res.clearCookie("Plix-auth");
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}
