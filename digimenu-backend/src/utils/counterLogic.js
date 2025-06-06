import Counter from '../models/Counter.js';

async function initCounter(counterName) {
  try {
    const counter = await Counter.findOne({ _id: counterName });
    if (!counter) {
      await Counter.create({ _id: counterName, sequence_value: 0 });
      console.log(`Counter "${counterName}" initialized with sequence_value: 0`);
    }
  } catch (error) {
    console.error(`Error initializing counter ${counterName}:`, error);
    throw error;
  }
}

async function getNextSequenceValue(counterName) {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: counterName },
      { $inc: { sequence_value: 1 } },
      { new: true, upsert: true }
    );
    return counter.sequence_value;
  } catch (error) {
    console.error(`Error getting next sequence value for ${counterName}:`, error);
    throw error;
  }
}

function getInvoiceNumber(sequenceValue) {
  const paddedNumber = String(sequenceValue).padStart(3, '0'); // Padding zero (3 chữ số)
  return `INV-${paddedNumber}`;
}

export { initCounter, getNextSequenceValue, getInvoiceNumber };