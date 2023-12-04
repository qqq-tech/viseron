import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useContext } from "react";
import LazyLoad from "react-lazyload";

import MutationIconButton from "components/buttons/MutationIconButton";
import VideoPlayerPlaceholder from "components/videoplayer/VideoPlayerPlaceholder";
import { AuthContext } from "context/AuthContext";
import { deleteRecordingParams, useDeleteRecording } from "lib/api/client";
import { getTimeFromDate, getVideoElement } from "lib/helpers";
import * as types from "lib/types";

interface RecordingCardInterface {
  camera: types.Camera | types.FailedCamera;
  recording: types.Recording;
}

export default function RecordingCard({
  camera,
  recording,
}: RecordingCardInterface) {
  const theme = useTheme();
  const { auth } = useContext(AuthContext);
  const deleteRecording = useDeleteRecording();

  return (
    <LazyLoad height={200}>
      <Card
        variant="outlined"
        sx={
          camera.failed
            ? {
                border: `2px solid ${
                  camera.retrying
                    ? theme.palette.warning.main
                    : theme.palette.error.main
                }`,
              }
            : undefined
        }
      >
        <CardContent>
          <Typography align="center">
            {getTimeFromDate(new Date(recording.start_time))}
          </Typography>
        </CardContent>
        <CardMedia>
          <LazyLoad
            height={200}
            offset={500}
            placeholder={
              <VideoPlayerPlaceholder
                aspectRatio={camera.width / camera.height}
              />
            }
          >
            {getVideoElement(camera, recording, auth.enabled)}
          </LazyLoad>
        </CardMedia>
        <CardActions>
          <Stack direction="row" spacing={1} sx={{ ml: "auto" }}>
            <Tooltip title="Delete Recording">
              <MutationIconButton<deleteRecordingParams>
                mutation={deleteRecording}
                onClick={() => {
                  deleteRecording.mutate({
                    identifier: camera.identifier,
                    date: recording.date,
                    recording_id: recording.id,
                    failed: camera.failed,
                  });
                }}
              >
                <DeleteForeverIcon />
              </MutationIconButton>
            </Tooltip>
          </Stack>
        </CardActions>
      </Card>
    </LazyLoad>
  );
}
