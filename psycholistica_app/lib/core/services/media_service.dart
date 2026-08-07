class MediaService {
  const MediaService();

  static const _imageDirectory = 'assets/demo/images';
  static const _videoDirectory = 'assets/demo/video';
  static const _audioDirectory = 'assets/demo/audio';

  String imagePath(String fileName) {
    return '$_imageDirectory/$fileName';
  }

  String videoPath(String fileName) {
    return '$_videoDirectory/$fileName';
  }

  String audioPath(String fileName) {
    return '$_audioDirectory/$fileName';
  }
}
