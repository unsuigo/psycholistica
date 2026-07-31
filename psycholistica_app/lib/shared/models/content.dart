import 'package:_app/shared/models/content_type.dart';

class Content {
  const Content({
    required this.id,
    required this.title,
    required this.description,
    required this.imageFile,
    required this.videoFile,
    required this.audioFile,
    required this.duration,
    required this.isPremium,
    required this.type,
    this.publishedAt,
  });

  final String id;
  final String title;
  final String description;
  final String imageFile;
  final String videoFile;
  final String audioFile;
  final Duration duration;
  final bool isPremium;
  final ContentType type;
  final DateTime? publishedAt;
}
