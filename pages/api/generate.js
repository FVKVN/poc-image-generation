import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export default async function (req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
            error: {
                message: "OpenAI API key not configured, please follow instructions in README.md",
            }
        });
        return;
    }

    const passengersObject = req.body.passengersObject || '';
    if (passengersObject.trim().length === 0) {
        res.status(400).json({
            error: {
                message: "Please enter a valid object",
            }
        });
        return;
    }

    try {
        const imageEdit = await openai.createImageEdit(
            fs.createReadStream('public/assets/original.png'),
            fs.createReadStream('public/assets/mask.png'),
            generateDescription(passengersObject),
            1,
            "1024x1024"
        );

        res.status(200).json({ image_url: imageEdit.data.data[0].url });
    } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if (error.response) {
            console.error(error.response.status, error.response.data);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.error(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}

function generateDescription(passengersObject) {
    return `Picture from the point of view of a person sitting in a subway cart seeing ${passengersObject}.`
}
