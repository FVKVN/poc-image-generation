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
        setIsLoading(true);
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
            setIsLoading(false);
            setResult(data.image_url);
        } catch(error) {
            // Consider implementing your own error handling logic here
            console.error(error);
            alert(error.message);
            setIsLoading(false);
        }
    }

    function generateShareUrl(result) {
        return `https://www.facebook.com/sharer/sharer.php?u=${result}`;
    }

    function resetForm(e) {
        e.preventDefault();

        setResult(null);
        setPassengersObject('');
    }

    return (
        <div>
            <Head>
                <title>OpenAI Quickstart</title>
            </Head>

            <main className={styles.main}>
                <div className={styles.formHolder}>
                    {!result && !isLoading &&
                        <form onSubmit={onSubmit}>
                            <h3 className={styles.prompt}>
                                I'm sitting on a tram together with
                                <input
                                    type="text"
                                    name="passengersObject"
                                    placeholder="voeg een object toe"
                                    className={styles.input}
                                    value={passengersObject}
                                    onChange={(e) => setPassengersObject(e.target.value)}
                                />
                            </h3>
                            { !result &&
                                <button className={styles.btn} type="submit">
                                    Generate
                                </button>
                            }
                        </form>
                    }
                    {isLoading &&
                        <p className={styles.loadingText}>
                            Loading
                        </p>
                    }
                    {
                        result && !isLoading &&
                        <>
                            <h3 className={styles.prompt}>
                            I'm sitting on a tram together with a {passengersObject}
                            </h3>
                            <button className={styles.btn} onClick={resetForm}>
                                Again
                            </button>
                            <a href={generateShareUrl(result)} className={styles.btn} target="_blank">
                                Share
                            </a>
                        </>
                    }
                </div>
                <aside className={styles.resultHolder}>
                    <img className={styles.result} src={result ? result : defaultImagePath} alt="" />
                </aside>

            </main>
        </div>
    );
}

