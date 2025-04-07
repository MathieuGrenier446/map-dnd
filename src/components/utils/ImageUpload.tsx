import { useState, useRef, ChangeEvent } from 'react';

export default function ImageUpload() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  // Set your size limit in bytes (e.g., 2MB = 2 * 1024 * 1024)
  const MAX_FILE_SIZE: number = 2 * 1024 * 1024;
  
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const file = event.target.files?.[0];
    setError(null);
    
    // Clear previous selection if no file is selected
    if (!file) {
      setSelectedImage(null);
      setPreviewUrl(null);
      return;
    }
    
    // Validate file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      resetFileInput();
      return;
    }
    
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size should be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
      resetFileInput();
      return;
    }
    
    // Create preview URL
    const fileReader = new FileReader();
    fileReader.onload = (): void => {
      setPreviewUrl(fileReader.result as string);
    };
    fileReader.readAsDataURL(file);
    
    setSelectedImage(file);
  };
  
  const resetFileInput = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setSelectedImage(null);
    setPreviewUrl(null);
  };
  
  const handleClear = (): void => {
    resetFileInput();
    setError(null);
  };

  return (
    <div className="image-upload-container">
      <div className="flex flex-col gap-4">
        {/* File Input */}
        <div className="flex flex-col">
          
        </div>
        
        {/* Preview Area */}
        <div className="preview-container">
            <div className="relative flex flex-col">
                <label className="mb-2 font-medium text-center">{`Upload Image (not yet functional)`}</label>
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-2 rounded"
                    hidden={true}
                />
                {error && <p className="text-red-500 mt-1">{error}</p>}
                <div className='flex items-center justify-center'>
                    <div className='relative'>
                        <img 
                        src={previewUrl || "icons/upload-image.png"} 
                        alt="Preview" 
                        className="max-w-xs max-h-64 object-contain outline-3 hover:outline-green-300 rounded active:outline-green-300"
                        width={64}
                        height={64}
                        onClick={()=>{fileInputRef.current?.click()}}
                        />
                        {
                            previewUrl &&
                            <button 
                            onClick={(e)=>{
                                e.stopPropagation()
                                handleClear()
                            }}
                            className="absolute -top-2 -right-2 px-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                            title="Clear selection"
                            >
                            ✕
                            </button>
                        }
                            
                    </div>
                    
                    
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};