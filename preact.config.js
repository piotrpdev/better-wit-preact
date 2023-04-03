import dotenv from 'dotenv';

dotenv.config();

// ? https://stackoverflow.com/a/70088745/19020549
// ? https://github.com/preactjs/preact-cli/wiki/Config-Recipes#use-environment-variables-in-your-application
export default (config, env, helpers) => {
    config.plugins.push(
        new helpers.webpack.DefinePlugin({
            'process.env.NEW_JSON_URL': JSON.stringify(process.env.NEW_JSON_URL),
            'process.env.OLD_JSON_URL': JSON.stringify(process.env.OLD_JSON_URL),
            'process.env.OLD_TIMETABLE_DATA': JSON.stringify(process.env.OLD_TIMETABLE_DATA),
        }),
    );
};