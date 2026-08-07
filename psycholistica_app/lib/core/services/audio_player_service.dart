import 'dart:async';

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
  String? _loadedAssetPath;

  Future<void> load(String assetPath) async {
    await _run(() async {
      debugPrint('[AUDIO] Requested asset: $assetPath');

      if (_loadedAssetPath == assetPath) {
        return;
      }

      debugPrint('[AUDIO] Loading...');
      await _player.setAsset(assetPath);
      _loadedAssetPath = assetPath;
      debugPrint('[AUDIO] Loaded');
      debugPrint('[AUDIO] Duration: ${_player.duration}');
    });
  }

  Future<void> play(String assetPath) async {
    await _run(() async {
      debugPrint('[AUDIO] Play pressed');
      await load(assetPath);
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
