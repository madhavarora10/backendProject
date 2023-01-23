export const displayMap=locations=>{
   var map=new maplibregl.Map({ 
      container:'map',
      style: 'https://api.maptiler.com/maps/streets/style.json?key=get_your_own_OpIi9ZULNHzrESv6T2vL',
      center:[-118.113491, 34.111745],
      zoom:4,    
    });
    
   locations.forEach(loc=> {
      
      new maplibregl
      .Marker()
      .setLngLat(loc.coordinates)
      .addTo(map);
   });

    map.scrollZoom.disable();
};



 
  