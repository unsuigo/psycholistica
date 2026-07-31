import 'package:_app/shared/datasources/local/local_content_datasource.dart';
import 'package:_app/shared/models/content.dart';
import 'package:_app/shared/models/content_type.dart';
import 'package:_app/shared/repositories/content_repository.dart';

class LocalContentRepository implements ContentRepository {
  const LocalContentRepository(this._datasource);

  final LocalContentDatasource _datasource;

  @override
  Future<List<Content>> getContent() {
    return _datasource.getContent();
  }

  @override
  Future<List<Content>> getContentByType(ContentType type) {
    return _datasource.getContentByType(type);
  }

  @override
  Future<Content?> getContentById(String id) {
    return _datasource.getContentById(id);
  }
}
