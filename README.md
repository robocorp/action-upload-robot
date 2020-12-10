# GitHub action to update a robot in Robocorp Cloud

This GitHub Actions uploads a robot to Robocorp Cloud. It updates a robot existing in Robocorp Cloud,
identified by `robot-id` option.

## Usage

### Example Workflow file

An example workflow file to update robot in Robocorp Cloud:

```yaml
jobs:
  upload-robot:
    runs-on: ubuntu-latest
    name: Upload robot
    steps:
      - uses: actions/checkout@master
      - name: Use Node.js 12.x
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: Upload robot to Robocorp Cloud
        uses: robocorp/action-upload-robot
        with:
          workspace-key: ${{ secrets.ROBOCORP_WORKSPACE_KEY }}
          workspace-id: ${{ secrets.ROBOCORP_WORKSPACE_ID }}
          robot-id: ${{ secrets.ROBOCORP_ROBOT_ID }}

```

##### Configuration

| option         | value   | default                      | description                                |
| -------------- | ------- | ---------------------------- | ------------------------------------------ |
| workspace-id   | string  |                              | The workspace ID                           |
| workspace-key  | string  |                              | Workspace API key in target workspace      |
| robot-id       | string  |                              | ID of the robot in Robocorp Cloud          |
| api-endpoint   | string  | https://api.eu1.robocloud.eu | Robocorp Cloud API URL                     |
