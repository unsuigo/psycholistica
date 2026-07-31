import 'package:_app/app/providers.dart';
import 'package:_app/shared/models/content.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final homeProvider = FutureProvider<List<Content>>((ref) {
  final useCase = ref.watch(loadContentUseCaseProvider);

  return useCase();
});
