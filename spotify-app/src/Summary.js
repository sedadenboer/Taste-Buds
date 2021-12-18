import React from "react";
import './styles.css';

export default function Summary({ tracks, artists, genreList, image }) {
    return (
        // Display summary in a single card
        <div class='card-summary'>
            {/* Artist photo of number 1 artist */}
            <img src={image} class='card__image-summary' alt='' />
            {/* Displaytop 5 artists */}
            <div class='card__body-summary' id='artistsSum'>
                <div class='summary-subtitle'>Top Artists</div>
                {artists.map(artist => <div>{artist}</div>)}
            </div>
            {/* Display top 5 tracks */}
            <div class='card__body-summary' id='tracksSum'>
                <div class='summary-subtitle'>Top Tracks</div>
                {tracks.map(track => <div>{track}</div>)}
            </div>
            {/* Display top 3 genres */}
            <div class='card__body-summary' id='genresSum'>
                <div class='summary-subtitle'>Top Genres</div>
                <div>{genreList[0]}</div>
                <div>{genreList[1]}</div>
                <div>{genreList[2]}</div>
            </div>
        </div>
    )
}