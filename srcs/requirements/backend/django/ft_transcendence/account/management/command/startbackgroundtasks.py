# from django.core.management.base import BaseCommand
# from account.tasks import check_user_activity

# class Command(BaseCommand):
#     help = 'Démarre les tâches en arrière-plan'

#     def handle(self, *args, **options):
#         self.stdout.write(self.style.SUCCESS('Start background tasks'))
#         check_user_activity(repeat=60)
