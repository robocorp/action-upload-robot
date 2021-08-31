# GitHub action to update a robot in Robocorp Control Room

This GitHub Actions uploads a robot to Robocorp Control Room. It updates a robot existing in Control Room,
identified by `robot-id` option.

## Usage

### Example Workflow file

An example workflow file to update robot in Control Room:

```yaml
jobs:
  upload-robot:
    runs-on: ubuntu-latest
    name: Upload robot
    steps:
      - name: Checkout files from repository
        uses: actions/checkout@v2
      - name: Upload robot to Control Room
        uses: robocorp/action-upload-robot@v1
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
| robot-id       | string  |                              | ID of the robot in Control Room            |
| api-endpoint   | string  | https://api.eu1.robocloud.eu | Control Room API URL                       |
| robot-dir      | string  | ./                           | Directory which to pack and upload         |
