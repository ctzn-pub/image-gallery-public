'use client';
import IconGrid from '@/site/IconGrid';
import { spinner } from '@/components/LittleSpinner';
import { useState } from 'react';

export type SwitcherSelection = 'full-frame' | 'grid' | 'sets' | 'admin';

export default function VariationButton({
  url,
  id,
  setCurrent
}: {
  url: string
  id: string
  setCurrent: any
}) {

  const [variations, setVariations] = useState<any[]>([]);

  const [prompts, setPrompts] = useState<any[]>([]); // Prompt state
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const [imageLoading, setImageLoading] = useState(false); // Loading state
  const [hasvariations, setHasVariations] = useState(false); // Loading state


  const fetchVariations = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await fetch('/api/prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, id }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setPrompts(data.images);
      await generateImages(data.images); // Generate images based on prompts

      //   setCurrent(data.images[0])

    } catch (error) {
      console.error('Error fetching variations:', error);
    } finally {
      setIsLoading(false); // Stop loading regardless of the outcome
    }
  };



  const generateImages = async (prompts: any) => {
    let isFirstPrompt = true; // Flag to track if we are processing the first prompt
    const startTime = performance.now(); // Start timer for this request

    for (const prompttext of prompts) {
      setHasVariations(true);

      setImageLoading(true); // Start loading
      try {
        const response = await fetch('/api/variations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompttext: prompttext.description, id: id }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();


        // setVariations(data);
        setVariations(currentVariations => [...currentVariations, data]);
        // If it's the first prompt, set current to the first result
        // if (isFirstPrompt) {
        //   setCurrent(data);
        //   isFirstPrompt = false; // Update the flag so this only happens once
        // }
        // setCurrent(data)

      } catch (error) {
        console.error('Error fetching variations:', error);
      } finally {
        const endTime = performance.now(); // End timer for this request
        console.log(`Time taken for prompt '${prompttext}': ${endTime - startTime} milliseconds`);

        setImageLoading(false); // Stop loading regardless of the outcome
      }
    }
  };

  return (
    <div>

      {
        hasvariations ? <></> :
          <button onClick={fetchVariations} className="hover:bg-gray-100 rounded-full p-2 cursor-pointer">
            {/* 
            {isLoading && imageLoading ? <div>  {spinner} </div> : } */}

            {isLoading ? <div></div> : <IconGrid />}

            {isLoading ? <div> {spinner} </div> : `Generate Variations`}

          </button>}



      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-4 mt-4">


        {variations.length > 0 && variations.map((variation, index) => (
          <button key={index} onClick={() => setCurrent(variation)} className="max-w-sm rounded overflow-hidden shadow-lg">
            <div key={index} className="max-w-sm rounded overflow-hidden shadow-lg">
              <img src={variation} alt={`Variation ${index + 1}`} className="w-full" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
