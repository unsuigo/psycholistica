import 'package:_app/shared/models/content.dart';
import 'package:_app/shared/repositories/content_repository.dart';

class LoadContentUseCase {
  const LoadContentUseCase(this._repository);

  final ContentRepository _repository;

  Future<List<Content>> call() {
    return _repository.getContent();
  }
}
