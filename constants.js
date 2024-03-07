const constants = {
    apiKey: '1ebd393b452ad20c1fe043a02880feae',
    cache_TTL: 1800, // 30 minutes in seconds
    apiPath: 'https://api.openweathermap.org/data/2.5',
    database_conf : {
        port: 5432,
        host: "",
        user: "postgres",
        database: "weather",
        password: "root"
    },
    secretekey: "*secretekey*",
}

module.exports = constants;