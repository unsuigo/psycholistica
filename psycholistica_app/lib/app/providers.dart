import 'package:_app/shared/datasources/local/local_content_datasource.dart';
import 'package:_app/shared/repositories/content_repository.dart';
import 'package:_app/shared/repositories/local_content_repository.dart';
import 'package:_app/shared/usecases/load_content_use_case.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final localContentDatasourceProvider = Provider<LocalContentDatasource>((ref) {
  return LocalContentDatasource();
});

final contentRepositoryProvider = Provider<ContentRepository>((ref) {
  final datasource = ref.watch(localContentDatasourceProvider);

  return LocalContentRepository(datasource);
});

final loadContentUseCaseProvider = Provider<LoadContentUseCase>((ref) {
  final repository = ref.watch(contentRepositoryProvider);

  return LoadContentUseCase(repository);
});
