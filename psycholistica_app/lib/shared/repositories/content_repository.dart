import 'package:_app/shared/models/content.dart';
import 'package:_app/shared/models/content_type.dart';

abstract class ContentRepository {
  Future<List<Content>> getContent();

  Future<List<Content>> getContentByType(ContentType type);

  Future<Content?> getContentById(String id);
}
