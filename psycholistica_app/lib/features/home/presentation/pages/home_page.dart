import 'package:_app/features/home/presentation/providers/home_provider.dart';
import 'package:_app/features/home/presentation/widgets/content_card.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

class HomePage extends ConsumerWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final content = ref.watch(homeProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Psycholistica')),
      body: content.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (error, stackTrace) => Center(child: Text(error.toString())),
        data: (items) => Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 900),
            child: ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: items.length,
              itemBuilder: (context, index) {
                final item = items[index];

                return ContentCard(
                  content: item,
                  onTap: () {
                    context.pushNamed('contentDetails', extra: item);
                  },
                );
              },
            ),
          ),
        ),
      ),
    );
  }
}
