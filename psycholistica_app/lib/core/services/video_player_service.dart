import 'dart:io';

import 'package:video_player/video_player.dart';

class VideoPlayerService {
  VideoPlayerController? _controller;

  VideoPlayerController? get controller => _controller;

  Future<void> initialize(String filePath) async {
    final controller = VideoPlayerController.file(File(filePath));
    _controller = controller;

    try {
      await controller.initialize();
      await controller.setVolume(0);
      await controller.setLooping(true);
      await controller.play();
    } catch (_) {
      await controller.dispose();
      _controller = null;
      rethrow;
    }
  }

  Future<void> dispose() async {
    await _controller?.dispose();
    _controller = null;
  }
}
