const aws = require("aws-sdk");

let secrets;

if (process.env.NODE_ENV == "production") {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require("./secrets"); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: "eu-west-1", // Make sure this corresponds to the region in which you have verified your email address (or 'eu-west-1' if you are using the Spiced credentials)
});

exports.sendEmail = (message, subject) => {
    return ses
        .sendEmail({
            Source: "Funky Chicken <shared.elbow@spicedling.email>",
            Destination: {
                ToAddresses: ["shared.elbow@spicedling.email"],
            },
            Message: {
                Body: {
                    Text: {
                        Data: message,
                    },
                },
                Subject: {
                    Data: subject,
                },
            },
        })
        .promise()
        .then(() => console.log("it worked - you've got mail 📬!"))
        .catch((err) => console.log(err));
};
