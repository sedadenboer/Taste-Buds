import React from "react";
import { Grid } from "@material-ui/core";
import './styles.css';

export default function TopTracksResult({ track, ranking }) {
    return (
        // Use grid layout for displaying track cards
        <Grid item>
            <div className='card-track'>
                {/* Album cover of track */}
                <img src={track.albumCover} className='card__image' alt='' />
                {/* Ranking and title of track */}
                <div className='card__body'>
                    {ranking}.
                    &nbsp;
                    {track.title}
                </div>
                {/* Artist of track */}
                <div className='card__body'>
                    {track.artist}
                </div>
                {/* Audio player for 30s preview */}
                <div className='card__actions'>
                    <audio controls="audio_play">
                        <source src={track.preview} type="audio/mpeg" />
                    </audio>
                </div>
            </div>
        </Grid >
    )
}