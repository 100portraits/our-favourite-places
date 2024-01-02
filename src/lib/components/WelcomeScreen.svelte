<script>
    //welcome screen asking users to input their favourite cafe, bar, and restaurant
    //this will be used to populate the map with markers
    //the markers will be stored in a store

    //search for the place when the user presses submit in the input field
    //use openstreetmap nominatim to search for a place

    let search = '';
    let searchResults = [];
    let showError = false;

    import { onMount } from "svelte";

    //get welcomed from store.js
    import { welcomed } from "../../lib/store.js";

    //get markers store
    import { markers } from "../../lib/store.js";

    $: console.log($markers);

    //import firestore collection
    let db;
    import { collection, getDocs, doc, setDoc, addDoc, updateDoc, getDoc } from "firebase/firestore";

    //load markers onMount
    onMount(async () => {
        //await import db from '../lib/ firebase';
        db = await import("../../lib/Firebase.js");
        db = db.db;
        
    });



    function placeSearch(input) {
        if (search.trim() === '') {
            showError = true;
        } else {
            showError = false;

            let url = `https://photon.komoot.io/api/?q=${input}&lat=52.4&lon=4.89&limit=3`
            fetch(url)
                .then((response) => response.json())
                //print name
                .then((data) => data.features)
                .then((data) => {
                    //replace _ with space in data.features.properties.osm_value
                    data.forEach((result) => {
                        result.properties.osm_value = result.properties.osm_value.replace(/_/g, ' ');
                    });
                    searchResults = data;
                });

                //clear the input
                document.querySelector('input').value = '';
                search = '';

        }
    }

    async function addMarker(result) {
        //log the result
        console.log(result);
        //first, check if the document with a matching ID exists in firestore
        console.log($markers)
        let markerExists = false;
        $markers.forEach((marker) => {
            if (marker.id === result.properties.osm_id.toString()) {
                markerExists = true;
            }
        });
        console.log(markerExists);

        //if marker exists, +1 to the marker's count
        if (markerExists) {
            console.log('marker exists');
            
            //get marker count
            let markerCount;
            await getDoc(doc(db, "locations", result.properties.osm_id.toString())).then((doc) => {
                if (doc.exists()) {
                    markerCount = doc.data().count;
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch((error) => {
                console.log("Error getting document:", error);
            });

            //increment marker count
            markerCount++;

            //update firestore
            await updateDoc(doc(db, "locations", result.properties.osm_id.toString()), {
                count: markerCount
            });


            //update store
            markers.update((markers) => {
                markers.forEach((marker) => {
                    if (marker.lngLat[0] === result.geometry.coordinates[0] && marker.lngLat[1] === result.geometry.coordinates[1]) {
                        marker.count = markerCount;
                    }
                });
                return markers;
            });

        } else {
            console.log('marker does not exist');
            //else add document to firestore with id as OSM_ID
            let mname;
            if (result.properties.name) {
                    mname = result.properties.name
                } else {
                    mname = result.properties.housenumber + " " + result.properties.street
                }
            await setDoc(doc(db, "locations", result.properties.osm_id.toString()), {
                
                name: mname,
                lat: result.geometry.coordinates[1],
                lon: result.geometry.coordinates[0],
                count: 1
            });



            //update store
            markers.update((markers) => [
                ...markers,
                {
                    id: result.properties.osm_id.toString(),
                    lngLat: [result.geometry.coordinates[0], result.geometry.coordinates[1]],
                    name: mname,
                    count: 1
                }
            ]);
        }
        

        //set welcomed
        welcomed.update((welcomed) => true);


    }
</script>

<div class='w-screen h-screen flex flex-col  '>
    <div class="max-w-[70vw] mx-auto my-10 overflow-auto w-full flex flex-col p-10">
        <h1 class="text-8xl font-bold lowercase">Our Favourite Places</h1>
        <p class="text-3xl font-bold pt-2">in development</p>
        <p class="text-xl ">by <a class="text-black underline pointer-events-auto" href="https://sahir.nl" target="_blank">Sahir</a></p>
        
        <div class='flex gap-2 w-full mt-10 mb-3 text-2xl'>
            

            <!-- input for user's favourite place with search button submit-->
            <input bind:value={search} on:keyup={e => e.key === 'Enter' && placeSearch(e.target.value)} class='w-full border focus:outline-neutral-500 border-neutral-300 rounded-lg p-2 px-6 shadow-md {showError ? 'border-red-500 focus:outline-red-500' : ''}' type="text" placeholder="Search for a place" />
            <button class='bg-neutral-200 rounded-md p-6 shadow-md' on:click={e => placeSearch(search)}>Search</button>


        
        </div>
        {#if showError}
            <p class='text-red-500'>Please enter a place</p>
        {/if  }

        {#if searchResults.length > 0}

        <div>
            <div class='flex flex-col gap-3 mt-2'>

                {#each searchResults as result}
                    <div class="w-full p-6  bg-neutral-100 shadow-md rounded-md flex justify-between items-center">
                        <div id='resultDetails'>
                            <h4 class="font-bold text-2xl">{result.properties.name ? result.properties.name : result.properties.housenumber+ " " + result.properties.street} <span class="font-normal">({result.properties.osm_value})</span></h4>
                            <p>{result.properties.street}, {result.properties.city}</p>

                        </div>
                        <button class='bg-neutral-200 shadow-md h-full rounded-md p-2 px-3  text-xl' on:click={e => addMarker(result)}>Add</button>
                    </div>
                {/each}
            </div>  
        </div>
        {/if}
    </div>
</div>
