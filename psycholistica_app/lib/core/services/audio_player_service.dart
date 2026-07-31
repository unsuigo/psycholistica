import 'dart:async';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:just_audio/just_audio.dart';

class AudioPlayerService {
  AudioPlayerService() : _player = AudioPlayer() {
    _errorSubscription = _player.errorStream.listen((error) {
      debugPrint('[AUDIO ERROR] $error');
    });
    _playerStateSubscription = _player.playerStateStream.listen(
      (state) {
        debugPrint('[AUDIO] Player state: $state');
      },
      onError: (Object error, StackTrace stackTrace) {
        debugPrint('[AUDIO ERROR] $error');
        debugPrintStack(stackTrace: stackTrace);
      },
    );
  }

  final AudioPlayer _player;
  late final StreamSubscription<PlayerException> _errorSubscription;
  late final StreamSubscription<PlayerState> _playerStateSubscription;
  String? _loadedFilePath;

  Future<void> load(String filePath) async {
    await _run(() async {
      debugPrint('[AUDIO] Requested file: $filePath');

      final fileExists = await File(filePath).exists();
      debugPrint('[AUDIO] File exists: $fileExists');

      if (!fileExists) {
        throw FileSystemException('Audio file does not exist', filePath);
      }

      if (_loadedFilePath == filePath) {
        return;
      }

      debugPrint('[AUDIO] Loading...');
      await _player.setFilePath(filePath);
      _loadedFilePath = filePath;
      debugPrint('[AUDIO] Loaded');
      debugPrint('[AUDIO] Duration: ${_player.duration}');
    });
  }

  Future<void> play(String filePath) async {
    await _run(() async {
      debugPrint('[AUDIO] Play pressed');
      await load(filePath);
      final playback = _player.play();
      await playback;
    });
  }

  Future<void> pause() {
    return _run(_player.pause);
  }

  Future<void> stop() {
    return _run(_player.stop);
  }

  Future<void> seek(Duration position) {
    return _run(() => _player.seek(position));
  }

  bool get isPlaying => _player.playing;

  Stream<Duration> get positionStream => _player.positionStream;

  Stream<Duration?> get durationStream => _player.durationStream;

  Stream<PlayerState> get playerStateStream => _player.playerStateStream;

  Future<void> dispose() async {
    await _run(() async {
      await _errorSubscription.cancel();
      await _playerStateSubscription.cancel();
      await _player.dispose();
    });
  }

  Future<T> _run<T>(Future<T> Function() action) async {
    try {
      return await action();
    } catch (error, stackTrace) {
      debugPrint('[AUDIO ERROR] $error');
      debugPrintStack(stackTrace: stackTrace);
      rethrow;
    }
  }
}
