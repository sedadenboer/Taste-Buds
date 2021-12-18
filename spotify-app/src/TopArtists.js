import React from "react";
import { Grid } from "@material-ui/core";
import './styles.css';

export default function TopArtistsResult({ artist, ranking }) {
    return (
        // Use grid layout for displaying artist cards
        <Grid item>
            <div class='card-artist'>
                {/* Artist photo */}
                <img class='card__image' src={artist.artistPhoto} alt='' />
                {/* Ranking and artist name */}
                <div class='card__body-artist'>
                    {ranking}.
                    &nbsp;
                    {artist.name}
                </div>
            </div>
        </Grid>
    )
}