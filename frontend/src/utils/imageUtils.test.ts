import { buildImageUrl, buildImageUrlWithDefaults, ImageConfig } from './imageUtils';

describe('imageUtils', () => {
  describe('buildImageUrl', () => {
    const testConfig: ImageConfig = {
      apiBaseUrl: 'https://test-api.example.com',
      defaultFallbackUrl: 'https://test-fallback.com/image.jpg'
    };

    it('should return fallback URL when path is null', () => {
      const result = buildImageUrl(null, testConfig);
      expect(result).toBe('https://test-fallback.com/image.jpg');
    });

    it('should return fallback URL when path is undefined', () => {
      const result = buildImageUrl(undefined, testConfig);
      expect(result).toBe('https://test-fallback.com/image.jpg');
    });

    it('should return fallback URL when path is empty string', () => {
      const result = buildImageUrl('', testConfig);
      expect(result).toBe('https://test-fallback.com/image.jpg');
    });

    it('should return absolute URL when path starts with /', () => {
      const result = buildImageUrl('/images/photo.jpg', testConfig);
      expect(result).toBe('/images/photo.jpg');
    });

    it('should return absolute URL when path starts with http', () => {
      const result = buildImageUrl('https://example.com/image.jpg', testConfig);
      expect(result).toBe('https://example.com/image.jpg');
    });

    it('should build full URL with API base URL for relative paths', () => {
      const result = buildImageUrl('images/photo.jpg', testConfig);
      expect(result).toBe('https://test-api.example.com/storage/images/photo.jpg');
    });

    it('should use default fallback when no config provided', () => {
      const result = buildImageUrl(null);
      expect(result).toBe('https://via.placeholder.com/400x300?text=Image+non+disponible');
    });

    it('should use default API base URL when no config provided', () => {
      const result = buildImageUrl('images/photo.jpg');
      expect(result).toBe('http://localhost:8000/storage/images/photo.jpg');
    });
  });

  describe('buildImageUrlWithDefaults', () => {
    it('should call buildImageUrl with default parameters', () => {
      const result = buildImageUrlWithDefaults('images/photo.jpg');
      expect(result).toBe('http://localhost:8000/storage/images/photo.jpg');
    });

    it('should handle null path with defaults', () => {
      const result = buildImageUrlWithDefaults(null);
      expect(result).toBe('https://via.placeholder.com/400x300?text=Image+non+disponible');
    });
  });
}); 