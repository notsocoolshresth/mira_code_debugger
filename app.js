async function sendRequest() {
    const code = document.getElementById('code').value;
    const error = document.getElementById('error').value;
    const language = document.getElementById('language').value;
    const outputSize = document.getElementById('output-size').value;
    const responseDiv = document.getElementById('response');
    const errorDiv = document.getElementById('error-message');
    const loadingIndicator = document.getElementById('loading-indicator');

    // Clear previous responses and show loading
    responseDiv.style.display = 'none';
    errorDiv.style.display = 'none';
    loadingIndicator.style.display = 'block';

    if (!code.trim() || !error.trim()) {
        loadingIndicator.style.display = 'none'; // Hide loading
        errorDiv.textContent = 'Please provide both the code and the error message.';
        errorDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch("https://flow-api.mira.network/v1/flows/flows/shresth/Code-Helper?version=0.0.3", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'miraauthorization': 'sb-8e7d79b6d6c5ad98e3b87242d74cb207'
            },
            body: JSON.stringify({
                input: {
                    code: code,
                    lang: language,
                    size: outputSize,
                    error: error
                }
            }),
        });

        const result = await response.json();

        if (response.ok) {
            const formattedResponse = formatResponse(result.result || 'No suggestion available.');
            responseDiv.innerHTML = formattedResponse;
            responseDiv.style.display = 'block';
        } else {
            errorDiv.textContent = result.error || 'An unknown error occurred.';
            errorDiv.style.display = 'block';
        }
    } catch (err) {
        errorDiv.textContent = 'Failed to connect to the server. Please try again later.';
        errorDiv.style.display = 'block';
    } finally {
        // Hide the loading indicator once the response is processed
        loadingIndicator.style.display = 'none';
    }
}


function formatResponse(responseText) {
    const lines = responseText.split('\n');
    let formatted = '';
    let inCodeBlock = false;

    lines.forEach(line => {
        if (line.trim().startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            formatted += inCodeBlock ? '<div class="code-block">' : '</div>';
        } else if (inCodeBlock) {
            formatted += `${line}\n`;
        } else {    
            formatted += `<div>${line}</div>`;
        }
    });

    return formatted;
}
