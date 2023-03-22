import Head from 'next/head';
import { useState } from 'react';

import styles from './index.module.css';

export default function Home() {
    const [passengersObject, setPassengersObject] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState();

    const defaultImagePath = '/assets/original.png';

    async function onSubmit(event) {
        event.preventDefault();
        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ passengersObject }),
            });

            const data = await response.json();
            if (response.status !== 200) {
                throw data.error || new Error(`Request failed with status ${response.status}`);
            }

            setResult(data.image_url);
            setPassengersObject("");
        } catch(error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div>
            <Head>
                <title>OpenAI Quickstart</title>
                <link rel="icon" href="/dog.png" />
            </Head>

            <main className={styles.main} style={{
                backgroundImage: `url(${result ? result : defaultImagePath})`
            }}>

                <form onSubmit={onSubmit}>
                    <h3 className={styles.prompt}>
                        Ik zit op de tram samen met een
                        <input
                            type="text"
                            name="passengersObject"
                            placeholder="voeg een object toe"
                            className={styles.input}
                            value={passengersObject}
                            onChange={(e) => setPassengersObject(e.target.value)}
                        />
                    </h3>
                    { result &&
                        <button className={styles.submit} type="submit">
                            Genereer afbeelding
                        </button>
                    }

                </form>
            </main>
        </div>
    );
}
