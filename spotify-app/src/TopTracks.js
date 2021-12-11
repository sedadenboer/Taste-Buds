import React from "react";
import { Grid } from "@material-ui/core";
import './styles.css';

export default function TopTracksResult({ track, ranking }) {
    return (
        <Grid item>
            <img src={track.albumCover} alt='' />
            <div class='top-tracks'>
                <div>
                    <h3>
                        {ranking}.
                        &nbsp;
                        {track.title}
                    </h3>
                </div>
                <div>{track.artist}</div>
                <p></p>
                <audio controls="audio_play">
                    <source src={track.preview} type="audio/mpeg" />
                </audio>
            </div>
        </Grid >
    )
}