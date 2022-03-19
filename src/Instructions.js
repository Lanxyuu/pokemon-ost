import React from 'react';

function Instructions() {
    return (
      <>
        <div className="notes-container"><div style={{textAlign: "center"}}>Notes:</div>
        <ul>
          <li>The battle theme of either a human character, an event (i.e. gyms, elite four, evil team), or a Pokemon/Pokemon group will play.</li>
          <li>For <b>Pokemon groups/pairs</b>, please name <b>one member</b> (e.g. "palkia" for "dialga/palkia", "uxie" for "uxie/azelf/mesprit", etc.)</li>
          <li>For <b>Gyms and Elite 4 battles</b>, please <b>specify the region in front</b> (e.g. "johto gym", "unova elite 4", etc.)</li>
        </ul>
        </div>
      </>
    );
}

export default Instructions;