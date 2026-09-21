  
console.log("LISTING:", listing);
console.log("GEOMETRY:", listing.geometry);
console.log("COORDINATES:", listing.geometry?.coordinates);

      let mapToken = mToken;
    const map = new mapboxgl.Map({
        accessToken: mapToken,
        container: 'map', // container ID
        style:"mapbox://styles/mapbox/streets-v12",
        center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 7 // starting zoom
    });

  const popup = new mapboxgl.Popup({ offset: 25 })
    .setHTML(`<h5>${listing.location}</h5><p>Exact location provided after booking</p>`);

//------------------------------------------------------------------
//adding an marker
//----------------------------------------------------------------
  //  const marker = new mapboxgl.Marker({
  //   color: '#FF0000', // set marker color
  //   scale: 1.5        // scale the marker size
  // })
  // .setLngLat(listing.geometry.coordinates)
  // .setPopup(popup)
  // .addTo(map);
  
  //----------------------------------------------------------
 // adding icon as marker
  //----------------------------------------------------------
  const el = document.createElement('div');
  el.className= 'listing-image-marker';
 el.style.backgroundImage = `url('${listing.image.url}')`;
  
  const marker = new mapboxgl.Marker({
    element:el,
    anchor:'bottom'
  })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(popup)
  .addTo(map);