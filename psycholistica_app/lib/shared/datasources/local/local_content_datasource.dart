import 'package:_app/shared/models/content.dart';
import 'package:_app/shared/models/content_type.dart';

class LocalContentDatasource {
  static const _content = [
    Content(
      id: 'morning-calm',
      title: 'Morning Calm',
      description: 'A short meditation for a calm start to the day.',
      imageFile: 'forest_stream.jpg',
      videoFile: 'forest_stream.mp4',
      audioFile: 'Nowe nagranie v.1.0.m4a',
      duration: Duration(minutes: 10),
      isPremium: false,
      type: ContentType.meditation,
    ),
    Content(
      id: 'understanding-stress',
      title: 'Understanding Stress',
      description: 'An introduction to recognizing and managing stress.',
      imageFile: 'campfire.jpg',
      videoFile: 'campfire.mp4',
      audioFile: 'Nowe nagranie v.1.0.m4a',
      duration: Duration(minutes: 7),
      isPremium: false,
      type: ContentType.article,
    ),
    Content(
      id: 'mindful-living',
      title: 'Mindful Living',
      description: 'A practical guide to bringing mindfulness into daily life.',
      imageFile: 'fireplace.jpg',
      videoFile: 'fireplace.mp4',
      audioFile: 'Nowe nagranie v.1.0.m4a',
      duration: Duration(hours: 4),
      isPremium: true,
      type: ContentType.book,
    ),
    Content(
      id: 'rest-and-restore',
      title: 'Rest and Restore',
      description: 'An audio journey focused on relaxation and recovery.',
      imageFile: 'candle.jpg',
      videoFile: 'candle.mp4',
      audioFile: 'Nowe nagranie v.1.0.m4a',
      duration: Duration(hours: 2, minutes: 30),
      isPremium: true,
      type: ContentType.audiobook,
    ),
    Content(
      id: 'emotional-awareness',
      title: 'Emotional Awareness',
      description: 'A foundational course for understanding emotions.',
      imageFile: 'ocean.jpg',
      videoFile: 'ocean.mp4',
      audioFile: 'Nowe nagranie v.1.0.m4a',
      duration: Duration(hours: 6),
      isPremium: true,
      type: ContentType.course,
    ),
  ];

  Future<List<Content>> getContent() async {
    return List.unmodifiable(_content);
  }

  Future<List<Content>> getContentByType(ContentType type) async {
    return List.unmodifiable(_content.where((content) => content.type == type));
  }

  Future<Content?> getContentById(String id) async {
    for (final content in _content) {
      if (content.id == id) {
        return content;
      }
    }

    return null;
  }
}
