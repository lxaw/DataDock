# Generated by Django 4.1.4 on 2023-12-22 16:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0019_tagdataset_alter_file_unique_together_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='dataset',
            name='name',
            field=models.CharField(default=1, max_length=128),
            preserve_default=False,
        ),
    ]