import React from "react";
import { Grid } from "@material-ui/core";
import './styles.css';

export default function TopArtistsResult({ artist, ranking }) {
    return (
        <Grid item>
            <div class='card-artist'>
                <img src={artist.artistPhoto} alt='' />
                <div class='card__body'>
                    {ranking}.
                    &nbsp;
                    {artist.name}
                </div>
            </div>
        </Grid>
    )
}