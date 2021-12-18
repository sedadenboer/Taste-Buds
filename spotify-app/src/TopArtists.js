import React from "react";
import { Grid } from "@material-ui/core";
import './styles.css';

export default function TopArtistsResult({ artist, ranking }) {
    return (
        // Use grid layout for displaying artist cards
        <Grid item>
            <div className='card-artist'>
                {/* Artist photo */}
                <img className='card__image' src={artist.artistPhoto} alt='' />
                {/* Ranking and artist name */}
                <div className='card__body-artist'>
                    {ranking}.
                    &nbsp;
                    {artist.name}
                </div>
            </div>
        </Grid>
    )
}