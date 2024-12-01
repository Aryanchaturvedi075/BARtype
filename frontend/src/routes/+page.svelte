<script>
  import { onMount } from 'svelte';
  import { generateEfficientRandomText } from 'shared/textGenerator';
  import {
    Button, Modal, ModalContent, ModalHeader, ModalBody, 
    ModalFooter, Table, Thead, Tbody, Tr, Th, Td, Spinner
  } from 'flowbite-svelte';

  let sampleText = '';
  let inputText = '';
  let displayText = '';
  let startTime = 0;
  let elapsedTime = 0;
  let timerInterval;
  let showModal = false;
  let isLoading = false;
  let stats = {
    wpm: 0,
    accuracy: 0,
    correct: 0,
    incorrect: 0,
    time: '00:00:00:00'
  };

  onMount(getNewText);

  async function getNewText() {
    isLoading = true;
    sampleText = await fetchTextFromAPI();
    inputText = '';
    displayText = '';
    resetStats();
    showModal = false;
    isLoading = false;
  }

  async function fetchTextFromAPI() {
    try {
      const response = await fetch('/api/text'); 
      const data = await response.json();
      return data.text;
    } catch (error) {
      console.error('Error fetching text:', error);
      return 'Error loading text. Please try again later.';
    }
  }

  function handleInput(event) {
    inputText = event.target.value;
    updateDisplayText();

    if (inputText.length === 1) {
      startTimer();
    }

    if (inputText.length >= sampleText.length) {
      stopTimer();
      calculateStats();
    }
  }

  function updateDisplayText() {
    displayText = '';
    for (let i = 0; i < inputText.length; i++) {
      if (sampleText[i] !== inputText[i]) {
        displayText += `<span class="wrong-letter">${inputText[i]}</span>`;
      } else {
        displayText += inputText[i];
      }
    }
  }

  function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateTimer, 10);
  }

  function stopTimer() {
    clearInterval(timerInterval);
    elapsedTime = Date.now() - startTime;
  }

  function updateTimer() {
    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;
    stats.time = formatTime(elapsedTime);
  }

  function formatTime(elapsedTime) {
    let hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    let minutes = Math.floor((elapsedTime / (1000 * 60)) % 60);
    let seconds = Math.floor((elapsedTime / 1000) % 60);
    let milliseconds = Math.floor((elapsedTime % 1000) / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}:${milliseconds}`;
  }

  function resetStats() {
    elapsedTime = 0;
    stats = {
      wpm: 0,
      accuracy: 0,
      correct: 0,
      incorrect: 0,
      time: '00:00:00:00'
    };
  }

  function calculateStats() {
    const inputWords = inputText.split(" ");
    const sampleWords = sampleText.split(" ");
    const actualWordCount = Math.min(inputWords.length, sampleWords.length);
    let mistakes = 0;

    for (let i = 0; i < actualWordCount; i++) {
      if (inputWords[i] !== sampleWords[i]) {
        mistakes++;
      }
    }

    const correct = actualWordCount - mistakes;
    const wpm = Math.round((correct / (elapsedTime / (1000 * 60)) + Number.EPSILON) * 100) / 100;
    const accuracy = (correct / actualWordCount) * 100;

    stats = {
      wpm,
      accuracy,
      correct,
      incorrect: mistakes,
      time: formatTime(elapsedTime)
    };

    showModal = true;
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-3xl font-bold mb-4">BARtype</h1>
  <p class="text-lg mb-6">Challenge your speed and accuracy.</p>

  {#if isLoading}
    <div class="flex justify-center mb-6">
      <Spinner size="xl" /> 
    </div>
  {:else}
    <Button on:click={getNewText} class="mb-6">
      Get New Text
    </Button>
  {/if}

  <div class="typing-area">
    <p class="sample-text whitespace-pre-wrap text-xl mb-4">{sampleText}</p>
    <input
      type="text"
      bind:value={inputText}
      on:input={handleInput}
      class="input-area w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div class="display-area whitespace-pre-wrap text-xl mt-4" innerHTML={displayText}></div>
  </div>

  {#if showModal}
    <Modal bind:open={showModal} size="md">
      <ModalContent>
        <ModalHeader>Your Stats</ModalHeader>
        <ModalBody>
          <Table>
            <Thead>
              <Tr>
                <Th>Metric</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>WPM</Td>
                <Td>{stats.wpm}</Td>
              </Tr>
              <Tr>
                <Td>Accuracy</Td>
                <Td>{stats.accuracy.toFixed(2)}%</Td>
              </Tr>
              <Tr>
                <Td>Time</Td>
                <Td>{stats.time}</Td>
              </Tr>
            </Tbody>
          </Table>
        </ModalBody>
        <ModalFooter>
          <Button color="gray" on:click={() => (showModal = false)}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  {/if}
</div>

<style lang="scss">
  /* .container {
      Add any custom container styles here if needed
  } */

  .sample-text {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .input-area {
    font-size: 1.2rem;
    padding: 0.75rem 1rem;
    border: 1px solid #ccc;
    border-radius: 0.375rem;
  }

  .display-area {
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .wrong-letter {
    color: red;
    font-weight: bold;
  }
</style>