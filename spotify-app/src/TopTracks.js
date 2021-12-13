import React from "react";
import { Grid, Card, CardMedia, CardContent, Typography, Box } from "@material-ui/core";
import './styles.css';

export default function TopTracksResult({ track, ranking }) {
    return (
        <Grid item>
            <div class='card-track'>
                <img src={track.albumCover} alt='' />
                <div class='card__body'>
                    {ranking}.
                    &nbsp;
                    {track.title}
                </div>
                <div class='card__body'>
                    {track.artist}
                </div>
                <div class='card__actions'>
                    <audio controls="audio_play">
                        <source src={track.preview} type="audio/mpeg" />
                    </audio>
                </div>

                {/* <div class='top-tracks'>
                        <div class='textbox-track'>
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
                    </div> */}
            </div>
        </Grid >
    )
}