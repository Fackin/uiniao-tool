import { SignJWT, importPKCS8 } from "jose";

const YourPrivateKey = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIMwPr/X8+2v+c/qEu0iJlEsjKWGmQza/HDbj8RJcb7jC
-----END PRIVATE KEY-----`.trim(); // 确保去除首尾空格


export const getWeatherToken = async (callback: (token: string) => void) => {
    function parsePem(pem: string) {
        const base64 = pem
            .replace(/-----BEGIN PRIVATE KEY-----/, '')
            .replace(/-----END PRIVATE KEY-----/, '')
            .trim();
        try {
            return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        } catch (e) {
            throw new Error('Invalid PEM: Base64 decoding failed');
        }
    }

    const der = parsePem(YourPrivateKey);
    console.log(der, 'YourPrivateKey'); // 应该是 Uint8Array

    // 检查浏览器是否支持 Ed25519
    const isEd25519Supported = (() => {
        try {
            return crypto.subtle.importKey(
                'raw',
                new Uint8Array(32),
                { name: 'Ed25519' },
                false,
                ['sign']
            ).then(() => true).catch(() => false);
        } catch {
            return false;
        }
    })();

    if (!isEd25519Supported) {
        alert('请使用 Chrome 93+/Firefox 91+/Safari 15+');
    }


    try {
        const key = await importPKCS8(`-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIKaXdVahI7Bk+9i8+Ouf27ljiSjbXYKXmmsiQFLyUKFe
-----END PRIVATE KEY-----`, 'EdDSA', {
            crv: 'Ed25519' // 明确声明曲线类型
        });
        console.log('Key imported successfully:', key);
        return key;
    } catch (e: any) {
        console.error('Failed to import key:', e);
        throw e;
    }
    // return

    importPKCS8(YourPrivateKey, 'ES256').then((privateKey) => {
        const customHeader = {
            alg: 'EdDSA',
            kid: 'CN584235G7'
        }
        const iat = Math.floor(Date.now() / 1000) - 30;
        const exp = iat + 900;
        const customPayload = {
            sub: '2JKQKCKBPT',
            iat: iat,
            exp: exp
        }
        new SignJWT(customPayload)
            .setProtectedHeader(customHeader)
            .sign(privateKey)
            .then(token => {
                console.log('JWT: ' + token)
                if (callback) callback(token)
            })
    }).catch((error) => console.error(error))
}

export interface WeatherOptions {
    location: string
}

export const getWeather = ({ location }: WeatherOptions) => {
    getWeatherToken((token) => {
        fetch(`https://api.qweather.com/v7/weather/now?location=${location}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            console.log("Weather:", res)
        }).catch(err => console.error("Error:", err))
    })
}