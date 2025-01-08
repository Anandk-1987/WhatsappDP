const dropZone = document.querySelector('.drop-zone');
    const fileInput = document.querySelector('.drop-zone__input');
    const previewCanvas = document.getElementById('preview');
    const backgroundCanvas = document.getElementById('background');
    const ctx = previewCanvas.getContext('2d');
    const bgCtx = backgroundCanvas.getContext('2d');
    const size = 400;

    previewCanvas.width = size;
    previewCanvas.height = size;
    backgroundCanvas.width = size;
    backgroundCanvas.height = size;

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.add('drop-zone--over');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZone.addEventListener(eventName, () => {
        dropZone.classList.remove('drop-zone--over');
      });
    });

    dropZone.addEventListener('drop', handleDrop, false);
    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', function(e) {
      if (this.files.length) {
        handleFile(this.files[0]);
      }
    });

    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;

      if (files.length) {
        handleFile(files[0]);
      }
    }

    function handleFile(file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
          const img = new Image();
          img.src = reader.result;
          img.onload = function() {
            processImage(img);
          };
        };
      } else {
        alert('Please upload an image file');
      }
    }

    function processImage(img) {
      const scale = Math.min(size / img.width, size / img.height);
      const width = img.width * scale;
      const height = img.height * scale;
      const x = (size - width) / 2;
      const y = (size - height) / 2;

      bgCtx.clearRect(0, 0, size, size);
      bgCtx.drawImage(img, x, y, width, height);

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, x, y, width, height);
    }

    document.getElementById('download-btn').addEventListener('click', () => {
      const link = document.createElement('a');
      link.download = 'whatsapp-dp.png';
      
      const finalCanvas = document.createElement('canvas');
      finalCanvas.width = size;
      finalCanvas.height = size;
      const finalCtx = finalCanvas.getContext('2d');
      
      finalCtx.filter = 'blur(20px)';
      finalCtx.drawImage(backgroundCanvas, 0, 0);
      
      finalCtx.filter = 'none';
      finalCtx.drawImage(previewCanvas, 0, 0);
      
      link.href = finalCanvas.toDataURL();
      link.click();
    });
