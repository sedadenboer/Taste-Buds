import React from "react";
import { Grid } from "@material-ui/core";
import './styles.css';

export default function TopArtistsResult({ artist }) {
    return (
        <Grid item>
            <img src={artist.artistPhoto} alt='' />
            <div class='top-artists'>
                <h3>{artist.name}</h3>
            </div>
        </Grid>
    )
}