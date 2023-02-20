import { getInput, setFailed } from '@actions/core';
import FormData from 'form-data'

import fetch from 'node-fetch';
import * as fs from 'fs';

import ncp from 'ncp';
import archiver from 'archiver';
import path from 'path';

const ROBOT_ENDPOINT = `${getInput('api-endpoint')}/robot-v2/workspaces/${getInput('workspace-id')}/robots`;

const headers = {
  'Authorization': `RC-WSKEY ${getInput('workspace-key')}`,
  'Content-Type': 'application/json',
};

const uploadRobot = async (robotId: string) => {
  const endPoint = `${ROBOT_ENDPOINT}/${robotId}/file/uploadlink`;
  const uploadLinkResponse = await fetch(endPoint, {method: 'GET', headers});
  const uploadLink = await uploadLinkResponse.json();
  if (!uploadLink?.url) {
    throw new Error(`Getting upload link failed for robot ID ${robotId}`);
  }
  const githubWorkspace = process.env.GITHUB_WORKSPACE as string;

  const robotBundleDir = await fs.promises.mkdtemp(path.join(githubWorkspace, 'robot-bundle-'));
  const robotContentDir = path.join(
    githubWorkspace,
    getInput('robot-dir')
  );
  const bundleOutputPath = path.join(githubWorkspace, 'robot-bundle.zip');

  const filterFileNames: string[] = [
    robotBundleDir,
    'node_modules',
    '.git',
    '.github',
    '.gitignore'
  ];

  const filter = (fileName: string): boolean =>
    filterFileNames.filter((filterFileName: string) =>
      fileName.indexOf(filterFileName) !== -1
    ).length === 0;

  await new Promise((resolve, reject) => {
    ncp(robotContentDir, robotBundleDir, { filter }, (err) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve('');
    });
  });

  await new Promise((resolve, reject) => {
    try {
      const archive = archiver('zip', {
        zlib: {level: 9},
      });

      const output = fs.createWriteStream(bundleOutputPath);
      output.on('close', () => {
        resolve('');
      });

      archive.directory(robotBundleDir, false);
      archive.pipe(output);
      archive.finalize();
    } catch {
      reject();
    }
  });

  const formData = new FormData();
  const stats = fs.statSync(bundleOutputPath);
  const fileSizeInBytes = stats.size;
  const file = fs.readFileSync(bundleOutputPath);

  for (const [key, value] of Object.entries(uploadLink.fields)) {
    formData.append(key, value as string | Blob);
  }
  formData.append('file', file);

  const formDataHeaders = formData.getHeaders();

  const response = await fetch(uploadLink.url, {
    method: 'POST',
    headers: {
      'Content-Type': formDataHeaders?.['content-type'],
      'Content-Length': fileSizeInBytes.toString(),
    },
    body: formData
  });

  if (!response.ok) {
    const responseTxt = await response.text();
    console.error(responseTxt);
    throw new Error('Robot bundle upload failed')
  }

  console.info(`Robot ${robotId} updated`);
};

/**
 * Trigger the action
 */
const upload = async (): Promise<void> => {
  try {
    const robotId = getInput('robot-id');
    if (robotId !== '') {
      await uploadRobot(robotId);
    } else {
      throw new Error('Robot id not given');
    }
  } catch (err) {
    if (err instanceof Error) {
      setFailed(err);
    } else {
      setFailed("Unknown error")
    }
  }
};

upload();
