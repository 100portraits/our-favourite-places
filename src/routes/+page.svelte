<script>
    import { MapLibre } from 'svelte-maplibre';
    import FaMapMarker from 'svelte-icons/fa/FaMapMarker.svelte'
    import { onMount } from 'svelte';
    import { Marker, Popup } from 'svelte-maplibre';
    import { writable } from 'svelte/store';

    //import firestore collection
    let db;
    import { collection, getDocs, doc } from 'firebase/firestore';

    //get markers store
    import { markers } from '../lib/store.js';


    //get welcomed from store.js
    import { welcomed } from '../lib/store.js';

    $: console.log($welcomed);

    //load markers onMount
    onMount(async () => {
        //await import db from '../lib/ firebase';
        db = await import('../lib/Firebase.js');
        db = db.db;
        
        //clear markers
        $markers = [];
        //get collection "locations" from firestore
        const querySnapshot = await getDocs(collection(db, 'locations'));
        
        //console log documents
        querySnapshot.forEach((doc) => {

            markers.update((markers) => [
                ...markers,
                {
                    id: doc.id,
                    lngLat: [doc.data().lon, doc.data().lat],
                    name: doc.data().name,
                    count: doc.data().count
                }
            ]);
        });
    });

    import WelcomeScreen from '../lib/components/WelcomeScreen.svelte';


    export const ssr = false;

  </script>
  {#if !$welcomed}
    <WelcomeScreen/>
  {:else}
  <div class='h-screen w-screen flex flex-col'>
      <div class="bg-none absolute z-10 w-full p-6 px-10 pointer-events-none">
        <h1 class=" text-8xl  font-bold lowercase">OUR FAVOURITE PLACES</h1>
        <p class="pt-2 px-2 text-3xl font-bold">in development</p>
        <p class=" px-2 text-xl ">by <a class="text-black underline pointer-events-auto" href="https://sahir.nl" target="_blank">Sahir</a></p>
      </div>

      <div class="text-3xl font-light lowercase z-10 flex fixed w-full h-full pointer-events-none justify-center items-end p-10 ">
        <button class="pointer-events-auto lowercase bg-neutral-800 text-white px-6 py-4 rounded-md shadow-md " on:click={() => {welcomed.update((welcomed) => false);}}>add place</button>
      </div>

      <MapLibre 
      center={[4.896084771073258, 52.3551715143613]}
      zoom={12}
      style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json" 
      class="map h-full w-full"
      >
      
      {#each $markers as marker}
      <Marker
        lngLat={marker.lngLat}

        class=" grid place-items-center"
    >
      <div class="text-black opacity-50" style="height: {(4+marker.count)*4}px; width: {(4+marker.count)*4}px">
        <FaMapMarker/>
      </div>
      <Popup popupClass='popup'>
        <div class="text-white text-2xl font-bold lowercase">
          {marker.name}, <span class="text-lg font-light ">+{marker.count}</span>
        </div>
      </Popup>
      </Marker>
    {/each}
  
      </MapLibre>

  </div>
    {/if}
  
  <style>



    :global(.maplibregl-popup-content) {
      background-color: #424242;
      color: white;
      border-radius: 10px;
      padding-left: 15px;
      padding-right: 15px;
    }
    
    
    :global(.maplibregl-popup-anchor-bottom .maplibregl-popup-tip) {
      border-bottom-color: #424242;
      border-top-color: #424242;

    }
    :global(.maplibregl-popup-anchor-top .maplibregl-popup-tip) {
      border-bottom-color: #424242;
      border-top-color: #424242;

    }

    :global(.maplibregl-popup-anchor-left .maplibregl-popup-tip) {
      border-left-color: #424242;
      border-right-color: #424242;

    }
    :global(.maplibregl-popup-anchor-right .maplibregl-popup-tip) {
      border-left-color: #424242;
      border-right-color: #424242;

    }

    :global(.maplibregl-popup-anchor-bottom-right .maplibregl-popup-tip,.maplibregl-popup-anchor-bottom-left .maplibregl-popup-tip) {
      border-top-color: #424242;

    }

    :global(.maplibregl-popup-anchor-top-right .maplibregl-popup-tip,.maplibregl-popup-anchor-top-left .maplibregl-popup-tip) {
      border-bottom-color: #424242;

    }

  </style>