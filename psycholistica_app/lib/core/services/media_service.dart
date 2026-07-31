class MediaService {
  const MediaService();

  static const _mediaDirectory = 'D:/Meditation/Media';
  static const _audioDirectory = 'D:/Meditation/Audio';

  String imagePath(String fileName) {
    return '$_mediaDirectory/$fileName';
  }

  String videoPath(String fileName) {
    return '$_mediaDirectory/$fileName';
  }

  String audioPath(String fileName) {
    return '$_audioDirectory/$fileName';
  }
}
