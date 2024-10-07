import {ACMClient, GetCertificateCommand, ImportCertificateCommand} from '@aws-sdk/client-acm';
import {fromEnv} from '@aws-sdk/credential-providers';
import fs from 'fs';
import commandline from './commandline.js';
import {DEBUG, LOG} from './log.js';

export async function handler() {
    const directory = `${process.env.NGINX_PROXY_MANAGER_PATH ?? '/nginx-proxy-manager'}/letsencrypt/live/npm-${process.env.NGINX_PROXY_MANAGER_CERT_ID}`;

    DEBUG(`Loading files .../cert.pem, .../fullchain.pem, .../privkey.pem`);
    const certs = {
        cert:      fs.readFileSync(`${directory}/cert.pem`, {encoding: 'utf8'}),
        fullchain: fs.readFileSync(`${directory}/fullchain.pem`, {encoding: 'utf8'}),
        privkey:   fs.readFileSync(`${directory}/privkey.pem`, {encoding: 'utf8'}),
    };
    DEBUG(`Files loaded .../cert.pem, .../fullchain.pem, .../privkey.pem`);

    const client = new ACMClient({
        credentials: fromEnv(),
        region:      process.env.AWS_REGION ?? 'eu-west-1',
    });

    DEBUG(`Requesting certificates from AWS`);
    const responseGet = await client.send(new GetCertificateCommand({
        CertificateArn: process.env.AWS_CERTIFICATE,
    }));
    DEBUG(`Certificates requested from AWS`);

    if (commandline.force !== true && responseGet.Certificate === certs.cert) {
        LOG('Certifactes was not change. No update required.');
        return 0;
    }

    DEBUG(`Updating certificates`);
    const responseImport = await client.send(new ImportCertificateCommand({
        CertificateArn:   process.env.AWS_CERTIFICATE,
        Certificate:      certs.cert,
        PrivateKey:       certs.privkey,
        CertificateChain: certs.fullchain
    }));
    if (responseImport.CertificateArn !== process.env.AWS_CERTIFICATE) {
        LOG(`Certificates update failed`);
        return 1;
    }

    LOG(`Certificates updated`);
    return 0;
}