import React, { useState, useEffect } from 'react';

const RFIDScanner = () => {
  const [device, setDevice] = useState(null);
  const [isReading, setIsReading] = useState(false);
  const [tags, setTags] = useState([]);
  const [error, setError] = useState('');

  // Function to connect to the RFID device
  const connectDevice = async () => {
    try {
      console.log('Attempting to connect to RFID reader...');
      const devices = await navigator.hid.requestDevice({
        filters: [{ vendorId: 0x1a86, productId: 0xE010 }],
      });

      if (devices.length === 0) {
        console.error('No RFID reader selected');
        setError('No RFID reader selected');
        return;
      }

      const selectedDevice = devices[0];
      console.log('Selected device:', {
        productName: selectedDevice.productName,
        vendorId: selectedDevice.vendorId,
        productId: selectedDevice.productId,
      });

      await selectedDevice.open();
      console.log('Device opened successfully');
      setDevice(selectedDevice);
      setError('');
    } catch (err) {
      console.error('Connection error:', err);
      setError('Failed to connect: ' + err.message);
    }
  };

  // Function to start reading tags
  const startReading = async () => {
    if (!device) {
      console.error('No device connected');
      setError('Please connect a device first');
      return;
    }
    setIsReading(true);

    try {
      const startCommand = new Uint8Array([0x53, 0x57, 0x00, 0x06, 0xff, 0x01, 0x00, 0x00, 0x00, 0x50]);
      // Convert Uint8Array to hex string
      const hexString = Array.from(startCommand)
        .map((byte) => byte.toString(16).padStart(2, '0'))
        .join(' ')
        .toUpperCase(); // Example: "53 57 00 06 FF 01 00 00 00 50"
    
      console.log('Hex string of start command:', hexString);
    
      await device.sendReport(0x00, startCommand);
      console.log('Start command sent successfully');
    } catch (err) {
      console.error('Error sending start command:', err);
      setError('Failed to start reading: ' + err.message);
    }
  };

  // Function to stop reading tags
  const stopReading = async () => {
    setIsReading(false);

    try {
      const stopCommand = new Uint8Array([0x53, 0x57, 0x00, 0x06, 0xff, 0x00, 0x00, 0x00, 0x00, 0x50]);
      await device.sendReport(0x00, stopCommand);
      console.log('Stop command sent successfully');
    } catch (err) {
      console.error('Error sending stop command:', err);
    }
  };

  // Function to clear the tags list
  const clearTags = () => {
    setTags([]);
  };

  // Logic for handling the input report from the device
  useEffect(() => {
    if (!device) return;

    const handleInputReport = (event) => {
      const { data } = event;
      const rawData = Array.from(new Uint8Array(data.buffer));
      console.log('Raw data received:', rawData);

      // Check for specific data format
      if (rawData[0] === 0x08 && rawData[1] === 0x43) {
        const epcLength = rawData[4];
        const epcData = rawData.slice(7, 7 + epcLength);

        // Convert epcData to a Hex string (Tag ID)
        const tagId = epcData
          .map((b) => b.toString(16).padStart(2, '0'))  // Convert each byte to hex
          .join('')  // Join them into a single string
          .toUpperCase();  // Convert to uppercase

        // Convert RSSI to Hex string
        const rssi = rawData[6].toString(16).padStart(2, '0').toUpperCase();

        // Add tag if it's not already in the list
        setTags((prevTags) => {
          if (!prevTags.find((tag) => tag.id === tagId)) {
            return [
              ...prevTags,
              {
                id: tagId,
                time: new Date().toLocaleTimeString(),
                rssi: rssi,
              },
            ];
          }
          return prevTags;
        });
      } else {
        console.warn('Unexpected data format received:', rawData);
      }
    };

    // Attach event listener for input reports
    device.addEventListener('inputreport', handleInputReport);

    return () => {
      // Cleanup the event listener when the component is unmounted or device changes
      device.removeEventListener('inputreport', handleInputReport);
    };
  }, [device]);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">UHF RFID Reader</h5>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <button
              className="btn btn-primary me-2"
              onClick={connectDevice}
              disabled={device !== null}
            >
              Connect Reader
            </button>
            <button
              className={`btn ${isReading ? 'btn-danger' : 'btn-success'} me-2`}
              onClick={isReading ? stopReading : startReading}
              disabled={!device}
            >
              {isReading ? 'Stop Reading' : 'Start Reading'}
            </button>
            <button className="btn btn-outline-secondary" onClick={clearTags}>
              Clear Tags
            </button>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="table-responsive">
            <table className="table table-bordered table-hover">
              <thead>
                <tr>
                  <th>Index</th>
                  <th>Time</th>
                  <th>Tag ID</th>
                  <th>RSSI</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag, index) => (
                  <tr key={index}>
                    <td>{(index + 1).toString().padStart(3, '0')}</td>
                    <td>{tag.time}</td>
                    <td><code>{tag.id}</code></td>
                    <td>{tag.rssi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFIDScanner;
