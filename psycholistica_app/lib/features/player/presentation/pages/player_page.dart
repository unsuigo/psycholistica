import 'dart:async';

import 'package:_app/core/services/audio_player_service.dart';
import 'package:_app/core/services/media_service.dart';
import 'package:_app/core/services/video_player_service.dart';
import 'package:_app/shared/models/content.dart';
import 'package:flutter/material.dart';
import 'package:video_player/video_player.dart';

class PlayerPage extends StatefulWidget {
  const PlayerPage({required this.content, super.key});

  final Content content;

  @override
  State<PlayerPage> createState() => _PlayerPageState();
}

class _PlayerPageState extends State<PlayerPage> {
  late final AudioPlayerService _audioPlayerService;
  late final VideoPlayerService _videoPlayerService;
  late final String _audioPath;
  late final String _videoPath;
  late final Future<void> _loadAudio;
  late final Future<void> _initializeVideo;

  @override
  void initState() {
    super.initState();
    _audioPlayerService = AudioPlayerService();
    _videoPlayerService = VideoPlayerService();
    _audioPath = const MediaService().audioPath(widget.content.audioFile);
    _videoPath = const MediaService().videoPath(widget.content.videoFile);
    _loadAudio = _audioPlayerService.load(_audioPath);
    _initializeVideo = _videoPlayerService.initialize(_videoPath);
  }

  @override
  void dispose() {
    unawaited(_audioPlayerService.dispose());
    unawaited(_videoPlayerService.dispose());
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colorScheme = Theme.of(context).colorScheme;
    final textTheme = Theme.of(context).textTheme;

    return Scaffold(
      appBar: AppBar(title: const Text('Player')),
      body: FutureBuilder<void>(
        future: _loadAudio,
        builder: (context, loadSnapshot) {
          final isLoaded =
              loadSnapshot.connectionState == ConnectionState.done &&
              !loadSnapshot.hasError;

          return StreamBuilder<Duration?>(
            stream: _audioPlayerService.durationStream,
            builder: (context, durationSnapshot) {
              final duration = durationSnapshot.data ?? Duration.zero;

              return StreamBuilder<Duration>(
                stream: _audioPlayerService.positionStream,
                initialData: Duration.zero,
                builder: (context, positionSnapshot) {
                  final position = positionSnapshot.data ?? Duration.zero;
                  final sliderMaximum = duration.inMilliseconds.toDouble();
                  final sliderValue = position.inMilliseconds
                      .clamp(0, duration.inMilliseconds)
                      .toDouble();

                  return SingleChildScrollView(
                    padding: const EdgeInsets.all(24),
                    child: Center(
                      child: ConstrainedBox(
                        constraints: const BoxConstraints(maxWidth: 900),
                        child: Column(
                          children: [
                            AspectRatio(
                              aspectRatio: 16 / 9,
                              child: FutureBuilder<void>(
                                future: _initializeVideo,
                                builder: (context, videoSnapshot) {
                                  final controller =
                                      _videoPlayerService.controller;

                                  if (videoSnapshot.connectionState ==
                                          ConnectionState.done &&
                                      !videoSnapshot.hasError &&
                                      controller != null &&
                                      controller.value.isInitialized) {
                                    return ClipRect(
                                      child: FittedBox(
                                        fit: BoxFit.cover,
                                        child: SizedBox(
                                          width: controller.value.size.width,
                                          height: controller.value.size.height,
                                          child: VideoPlayer(controller),
                                        ),
                                      ),
                                    );
                                  }

                                  return ColoredBox(
                                    color: colorScheme.surfaceContainerHighest,
                                    child: Icon(
                                      Icons.album_outlined,
                                      size: 80,
                                      color: colorScheme.onSurfaceVariant,
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 32),
                            Text(
                              widget.content.title,
                              textAlign: TextAlign.center,
                              style: textTheme.headlineSmall,
                            ),
                            const SizedBox(height: 8),
                            Text('Unknown', style: textTheme.bodyLarge),
                            const SizedBox(height: 24),
                            Slider(
                              value: sliderValue,
                              max: sliderMaximum > 0 ? sliderMaximum : 1,
                              onChanged: isLoaded
                                  ? (value) {
                                      unawaited(
                                        _audioPlayerService.seek(
                                          Duration(milliseconds: value.round()),
                                        ),
                                      );
                                    }
                                  : null,
                            ),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(_formatDuration(position)),
                                Text(_formatDuration(duration)),
                              ],
                            ),
                            const SizedBox(height: 24),
                            StreamBuilder(
                              stream: _audioPlayerService.playerStateStream,
                              builder: (context, playerStateSnapshot) {
                                final isPlaying = _audioPlayerService.isPlaying;

                                return Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: [
                                    IconButton(
                                      onPressed: isLoaded
                                          ? () {
                                              _skip(
                                                position,
                                                duration,
                                                const Duration(seconds: -10),
                                              );
                                            }
                                          : null,
                                      icon: const Icon(Icons.replay_10_rounded),
                                      iconSize: 36,
                                    ),
                                    const SizedBox(width: 24),
                                    IconButton.filled(
                                      onPressed: isLoaded
                                          ? () {
                                              if (isPlaying) {
                                                unawaited(
                                                  _audioPlayerService.pause(),
                                                );
                                              } else {
                                                unawaited(
                                                  _audioPlayerService.play(
                                                    _audioPath,
                                                  ),
                                                );
                                              }
                                            }
                                          : null,
                                      icon: Icon(
                                        isPlaying
                                            ? Icons.pause_rounded
                                            : Icons.play_arrow_rounded,
                                      ),
                                      iconSize: 48,
                                    ),
                                    const SizedBox(width: 24),
                                    IconButton(
                                      onPressed: isLoaded
                                          ? () {
                                              _skip(
                                                position,
                                                duration,
                                                const Duration(seconds: 10),
                                              );
                                            }
                                          : null,
                                      icon: const Icon(
                                        Icons.forward_10_rounded,
                                      ),
                                      iconSize: 36,
                                    ),
                                  ],
                                );
                              },
                            ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }

  String _formatDuration(Duration duration) {
    final minutes = duration.inMinutes;
    final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');

    return '$minutes:$seconds';
  }

  void _skip(Duration position, Duration duration, Duration offset) {
    final targetMilliseconds = (position.inMilliseconds + offset.inMilliseconds)
        .clamp(0, duration.inMilliseconds);

    unawaited(
      _audioPlayerService.seek(Duration(milliseconds: targetMilliseconds)),
    );
  }
}
